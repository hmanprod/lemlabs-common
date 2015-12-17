<?php

namespace LemLabs\CommonBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;

/**
 * This is the class that loads and manages your bundle configuration
 *
 * To learn more see {@link http://symfony.com/doc/current/cookbook/bundles/extension.html}
 */
class LemLabsCommonExtension extends Extension
{
    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        
        $loader = new Loader\YamlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('services.yml');
//        $loader->load('config.yml');
        
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        
        $container->setParameter('lemlabs_common.base_template', $config['base_template']);
        $container->setParameter('lemlabs_common.form_template', $config['form_template']);
        $container->setParameter('lemlabs_common.knp_menu_builder', $config['knp_menu_builder']);
	$container->setParameter('lemlabs_common.knp_menu_template', $config['knp_menu_template']);
    }
    
    public function getAlias()
    {
        return 'lemlabs_common';
    }
}
