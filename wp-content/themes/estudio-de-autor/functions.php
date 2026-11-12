<?php
/**
 * Estudio de Autor: one-page WordPress theme and first-party lead management.
 * No payment credentials or external APIs are needed.
 */
if (!defined('ABSPATH')) { exit; }

define('EDA_VERSION', '3.1.0');

function eda_plans() {
    return [
        'Inicio'     => ['price'=>790,   'hours'=>0.5],
        'Impulso'    => ['price'=>1990,  'hours'=>1.5],
        'Presencia'  => ['price'=>4990,  'hours'=>4],
        'Evolución'  => ['price'=>10900, 'hours'=>9],
        'Integral'   => ['price'=>19900, 'hours'=>16],
    ];
}

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
});

add_action('wp_enqueue_scripts', function () {
    $uri = get_template_directory_uri();
    wp_enqueue_style('eda-office-vr', $uri . '/assets/css/office-vr.css', [], EDA_VERSION);
    // A-Frame is open-source. The production site requires an internet connection to fetch this library.
    // For strict self-hosting, replace this URL with a tested local copy from its official release.
    wp_enqueue_script('eda-aframe', 'https://aframe.io/releases/1.8.0/aframe.min.js', [], '1.8.0', false);
    wp_enqueue_script('eda-office-vr', $uri . '/assets/js/office-vr.js', ['eda-aframe'], EDA_VERSION, true);
    wp_localize_script('eda-office-vr', 'EstudioConfig', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('eda_submit'),
    ]);
});

add_action('init', function () {
    register_post_type('eda_lead', [
        'label' => 'Solicitudes',
        'public' => false,
        'publicly_queryable' => false,
        'show_ui' => false,
        'show_in_rest' => false,
        'exclude_from_search' => true,
        'supports' => ['title'],
    ]);
});

function eda_submit_lead() {
    if (strtoupper((string) $_SERVER['REQUEST_METHOD']) !== 'POST') {
        wp_send_json_error(['message' => 'Método no permitido.'], 405);
    }
    if (!check_ajax_referer('eda_submit', 'nonce', false)) {
        wp_send_json_error(['message' => 'La sesión del formulario venció. Actualiza la página.'], 403);
    }
    $raw = wp_unslash($_POST);
    if (!empty($raw['website'])) {
        wp_send_json_success(['folio' => 'RECIBIDA']);
    }
    $name = sanitize_text_field($raw['name'] ?? '');
    $company = sanitize_text_field($raw['company'] ?? '');
    $email = sanitize_email($raw['email'] ?? '');
    $phone = sanitize_text_field($raw['phone'] ?? '');
    $description = sanitize_textarea_field($raw['description'] ?? '');
    $service = sanitize_text_field($raw['service'] ?? '');
    $plan = sanitize_text_field($raw['plan'] ?? '');
    $consent = !empty($raw['consent']);
    $allowed_services = ['Web / WordPress', 'Diseño / redes', 'Video / guiones', 'SEO / marketing', 'Prototipos / automatización', 'Blockchain / viabilidad', 'Otra idea'];
    if (mb_strlen($name) < 2 || mb_strlen($name) > 100 || !is_email($email) || mb_strlen($description) < 15 || mb_strlen($description) > 2000 || !$consent || !array_key_exists($plan, eda_plans()) || !in_array($service, $allowed_services, true)) {
        wp_send_json_error(['message' => 'Revisa los campos obligatorios y el consentimiento.'], 422);
    }
    if (mb_strlen($company) > 120 || mb_strlen($phone) > 30) {
        wp_send_json_error(['message' => 'Uno de los campos supera el límite permitido.'], 422);
    }
    // Low-cost abuse prevention without retaining plaintext IP addresses.
    $ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $key = 'eda_rl_' . substr(hash_hmac('sha256', $ip, wp_salt('nonce')), 0, 32);
    $attempts = (int) get_transient($key);
    if ($attempts >= 4) {
        wp_send_json_error(['message' => 'Se alcanzó el límite temporal de solicitudes. Inténtalo más tarde.'], 429);
    }
    set_transient($key, $attempts + 1, HOUR_IN_SECONDS);
    $id = wp_insert_post([
        'post_type' => 'eda_lead',
        'post_title' => $name . ($company ? ' · ' . $company : ''),
        'post_status' => 'private',
    ], true);
    if (is_wp_error($id) || !$id) {
        wp_send_json_error(['message' => 'No se pudo guardar la solicitud. Inténtalo de nuevo.'], 500);
    }
    $fields = [
        '_eda_name' => $name,
        '_eda_company' => $company,
        '_eda_email' => $email,
        '_eda_phone' => $phone,
        '_eda_description' => $description,
        '_eda_service' => $service,
        '_eda_plan' => $plan,
        '_eda_status' => 'nuevo',
        '_eda_consent_at' => current_time('mysql', true),
    ];
    foreach ($fields as $meta_key => $value) {
        update_post_meta($id, $meta_key, $value);
    }
    $folio = 'EA-' . str_pad((string) $id, 6, '0', STR_PAD_LEFT);
    // Notification is best-effort and does not expose the administrator's email publicly.
    wp_mail(get_option('admin_email'), 'Nueva solicitud ' . $folio, "Solicitud: {$folio}\nPlan: {$plan}\nEntra a WordPress → Solicitudes para ver los detalles.");
    wp_send_json_success(['folio' => $folio]);
}
add_action('wp_ajax_nopriv_eda_submit_lead', 'eda_submit_lead');
add_action('wp_ajax_eda_submit_lead', 'eda_submit_lead');

function eda_active_hours() {
    $ids = get_posts([
        'post_type' => 'eda_lead', 'post_status' => 'private',
        'posts_per_page' => 250, 'fields' => 'ids',
        'meta_key' => '_eda_status', 'meta_value' => 'activo',
    ]);
    $total = 0;
    $plans = eda_plans();
    foreach ($ids as $id) {
        $plan = get_post_meta($id, '_eda_plan', true);
        $total += (float) ($plans[$plan]['hours'] ?? 0);
    }
    return $total;
}

add_action('admin_menu', function () {
    add_menu_page('Solicitudes del estudio', 'Solicitudes', 'manage_options', 'eda-leads', 'eda_admin_page', 'dashicons-art', 27);
});

add_action('admin_post_eda_update_lead', function () {
    if (!current_user_can('manage_options')) { wp_die('No autorizado.', '', ['response'=>403]); }
    $id = absint($_POST['lead_id'] ?? 0);
    check_admin_referer('eda_lead_' . $id);
    $lead = get_post($id);
    if (!$lead || $lead->post_type !== 'eda_lead') { wp_die('Solicitud no encontrada.', '', ['response'=>404]); }
    $status = sanitize_key($_POST['lead_status'] ?? 'nuevo');
    $valid = ['nuevo','en_revision','activo','cerrado','descartado'];
    if (!in_array($status, $valid, true)) { wp_die('Estado inválido.', '', ['response'=>422]); }
    $current = get_post_meta($id, '_eda_status', true);
    if ($status === 'activo' && $current !== 'activo') {
        $plan = get_post_meta($id, '_eda_plan', true);
        $hours = (float) (eda_plans()[$plan]['hours'] ?? 0);
        if (eda_active_hours() + $hours > 55) {
            wp_safe_redirect(admin_url('admin.php?page=eda-leads&notice=capacity'));
            exit;
        }
    }
    update_post_meta($id, '_eda_status', $status);
    wp_safe_redirect(admin_url('admin.php?page=eda-leads&notice=updated'));
    exit;
});

add_action('admin_post_eda_delete_lead', function () {
    if (!current_user_can('manage_options')) { wp_die('No autorizado.', '', ['response'=>403]); }
    $id = absint($_POST['lead_id'] ?? 0);
    check_admin_referer('eda_delete_' . $id);
    $lead = get_post($id);
    if (!$lead || $lead->post_type !== 'eda_lead') { wp_die('Solicitud no encontrada.', '', ['response'=>404]); }
    wp_trash_post($id);
    wp_safe_redirect(admin_url('admin.php?page=eda-leads&notice=deleted'));
    exit;
});

function eda_admin_page() {
    if (!current_user_can('manage_options')) { return; }
    $leads = get_posts(['post_type'=>'eda_lead', 'post_status'=>'private', 'posts_per_page'=>80, 'orderby'=>'date', 'order'=>'DESC']);
    $hours = eda_active_hours();
    echo '<div class="wrap"><h1>Estudio de Autor · Solicitudes</h1>';
    echo '<p>Las solicitudes no constituyen contratos ni pagos. Cambia a <strong>Activo</strong> solo después de confirmar el acuerdo y el cobro en Mercado Pago. El límite es de 55 horas activas mensuales; cierra los planes que terminen.</p>';
    echo '<p><strong>Capacidad activa registrada: '.esc_html((string)$hours).' / 55 horas</strong></p>';
    $notice = sanitize_key($_GET['notice'] ?? '');
    if ($notice === 'capacity') { echo '<div class="notice notice-error"><p>No se activó: superarías las 55 horas disponibles.</p></div>'; }
    if ($notice === 'updated' || $notice === 'deleted') { echo '<div class="notice notice-success"><p>Registro actualizado.</p></div>'; }
    echo '<p><a href="https://www.mercadopago.com.mx/developers/es/docs/subscription-plans/create-subscription-plan" target="_blank" rel="noopener noreferrer">Cómo crear un enlace de suscripción en Mercado Pago ↗</a></p>';
    echo '<table class="widefat striped"><thead><tr><th>Cliente</th><th>Contacto</th><th>Servicio y necesidad</th><th>Plan / horas</th><th>Estado</th><th>Administrar</th></tr></thead><tbody>';
    foreach ($leads as $lead) {
        $id = $lead->ID;
        $read = function($key) use ($id) { return (string) get_post_meta($id, '_eda_'.$key, true); };
        $name = $read('name'); $company = $read('company'); $email = $read('email'); $phone = $read('phone');
        $plan = $read('plan'); $service = $read('service'); $description = $read('description'); $status = $read('status');
        $hours_plan = eda_plans()[$plan]['hours'] ?? 0;
        echo '<tr><td><strong>'.esc_html($name).'</strong><br>'.esc_html($company).'<br><small>'.esc_html($lead->post_date).'</small></td>';
        echo '<td><a href="mailto:'.esc_attr($email).'">'.esc_html($email).'</a><br>'.esc_html($phone).'</td>';
        echo '<td><strong>'.esc_html($service).'</strong><p>'.nl2br(esc_html($description)).'</p></td>';
        echo '<td>'.esc_html($plan).' ('.esc_html((string)$hours_plan).' h)</td>';
        echo '<td>'.esc_html(ucfirst(str_replace('_', ' ', $status))).'</td>';
        echo '<td><form method="post" action="'.esc_url(admin_url('admin-post.php')).'" style="margin-bottom:8px">';
        echo '<input type="hidden" name="action" value="eda_update_lead"><input type="hidden" name="lead_id" value="'.esc_attr((string)$id).'">';
        wp_nonce_field('eda_lead_'.$id);
        echo '<select name="lead_status" aria-label="Estado">';
        foreach (['nuevo'=>'Nuevo','en_revision'=>'En revisión','activo'=>'Activo','cerrado'=>'Cerrado','descartado'=>'Descartado'] as $value=>$label) {
            echo '<option value="'.esc_attr($value).'"'.selected($status,$value,false).'>'.esc_html($label).'</option>';
        }
        echo '</select> <button class="button button-primary">Guardar</button></form>';
        echo '<form method="post" action="'.esc_url(admin_url('admin-post.php')).'" onsubmit="return confirm(\'¿Enviar esta solicitud a la papelera?\')">';
        echo '<input type="hidden" name="action" value="eda_delete_lead"><input type="hidden" name="lead_id" value="'.esc_attr((string)$id).'">';
        wp_nonce_field('eda_delete_'.$id);
        echo '<button class="button button-link-delete">Papelera</button></form></td></tr>';
    }
    if (!$leads) { echo '<tr><td colspan="6">Todavía no hay solicitudes.</td></tr>'; }
    echo '</tbody></table><p>Para contratos recurrentes, el control financiero definitivo se lleva en Mercado Pago. Este panel controla capacidad manual, no verifica transacciones ni recibe webhooks.</p></div>';
}