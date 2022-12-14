<?php
/** @var MapasCulturais\Theme $this */
use MapasCulturais\App;
use MapasCulturais\i;
$app = App::i();

$this->import('
    notification-modal
');
?>
<?php if (!$app->user->is('guest')): ?>
    <notification-modal media-query="<?= $media_query ?>" #default="{modal}">
        <a @click="modal.open"><?php i::esc_attr_e('Notificações') ?></a>
    </notification-modal>
<?php endif; ?>