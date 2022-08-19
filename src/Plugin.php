<?php

namespace spicyweb\blockbatchactions;

use Craft;
use craft\base\Plugin as BasePlugin;
use craft\controllers\ElementsController;
use craft\events\DefineElementEditorHtmlEvent;
use spicyweb\blockbatchactions\assets\BlockBatchActionsAsset;
use yii\base\Event;

/**
 * Class Plugin
 *
 * @package spicyweb\blockbatchactions
 * @author Spicy Web <plugins@spicyweb.com.au>
 * @since 1.0.0
 */
class Plugin extends BasePlugin
{
    /**
     * @inheritdoc
     */
    public function init(): void
    {
        parent::init();

        $request = Craft::$app->getRequest();

        if ($request->getIsCpRequest() && !$request->getIsAjax()) {
            Event::on(
                ElementsController::class,
                ElementsController::EVENT_DEFINE_EDITOR_CONTENT,
                function (DefineElementEditorHtmlEvent $e) {
                    Craft::$app->getView()->registerAssetBundle(BlockBatchActionsAsset::class);
                }
            );
        }
    }
}
