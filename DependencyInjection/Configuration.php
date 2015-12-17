<?php

namespace LemLabs\CommonBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * This is the class that validates and merges configuration from your app/config files
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html#cookbook-bundles-extension-config-class}
 */
class Configuration implements ConfigurationInterface
{
    /**
     * {@inheritDoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('lemlabs_common');
        
        $rootNode
            ->children()
                        ->scalarNode('base_template')->defaultValue("LemLabsCommonBundle:Base:base-coco.html.twig")->end()
                        ->scalarNode('form_template')->defaultValue("LemLabsCommonBundle:Form:forms-bootstrap3.html.twig")->end()
                        ->scalarNode('knp_menu_builder')->defaultValue("")->end()
			->scalarNode('knp_menu_template')->defaultValue('LemLabsCommonBundle:Menu:knp_menu.html.twig')->end()
                    ->end()
            ->end()
        ;

        // Here you should define the parameters that are allowed to
        // configure your bundle. See the documentation linked above for
        // more information on that topic.

        return $treeBuilder;
    }
}
