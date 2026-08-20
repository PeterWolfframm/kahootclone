<?php

namespace Grav\Plugin;

use Grav\Common\Plugin;

class UmamiPlugin extends Plugin
{
    public static function getSubscribedEvents(): array
    {
        return [
            'onOutputGenerated' => ['onOutputGenerated', 0],
        ];
    }

    public function onOutputGenerated(): void
    {
        $id = $this->config->get('plugins.umami.website_id');
        $src = $this->config->get('plugins.umami.script_url');
        $domains = $this->config->get('plugins.umami.domains');
        if (!$id || !$src) {
            return;
        }

        $attrs = 'defer src="' . htmlspecialchars((string) $src, ENT_QUOTES) . '" data-website-id="' . htmlspecialchars((string) $id, ENT_QUOTES) . '"';
        if ($domains) {
            $attrs .= ' data-domains="' . htmlspecialchars((string) $domains, ENT_QUOTES) . '"';
        }
        $snippet = '<script ' . $attrs . '></script>';
        $this->grav->output = str_replace('</head>', $snippet . '</head>', (string) $this->grav->output);
    }
}
