<?php

namespace LemLabs\CommonBundle\Twig;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Adds some twig syntax helper extension
 *
 */
class ToolsExtension extends \Twig_Extension
{
    protected $container;

    public function __construct(ContainerInterface $serviceContainer)
    {
            $this->container = $serviceContainer;
    }

    public function getFilters()
    {
        return array(
        	'unit' => new \Twig_Filter_Method($this, 'unit'),
        	'plural' => new \Twig_Filter_Method($this, 'plural'),
        );
    }
    
    public function getFunctions()
    {
    	return array(
            new \Twig_SimpleFunction('controllername', array($this, 'getControllerName')),
            new \Twig_SimpleFunction('base_template', array($this, 'getBaseTemplate')),
            new \Twig_SimpleFunction('form_template', array($this, 'getFormTemplate')),
            new \Twig_SimpleFunction('knp_menu_controller', array($this, 'getKnpMenuController')),
    	);
    }

    public function unit($data, $unit, $na = '-'){
			if(!$data)
				return $na;
    	return $data.' '.$unit;
    }

    public function plural($data){
    	if((int)$data > 1)
    		return 's';
    }
    
    public function getKnpMenuController()
    {
        if($this->container->getParameter('lemlabs_common.knp_menu_controller'))
            return $this->container->getParameter('lemlabs_common.knp_menu_controller');
        return null;
    }
    
    public function getBaseTemplate()
    {
        return $this->container->getParameter('lemlabs_common.base_template');
    }
    
    public function getFormTemplate()
    {
        return $this->container->getParameter('lemlabs_common.form_template');
    }

    public function getControllerName()
    {
		$controller = $container->getRequest()->attributes->get('_controller');
		preg_match('/(.*)\\\Bundle\\\(.*)\\\Controller\\\(.*)Controller::(.*)Action/', $controller, $matches);

		if(isset($matches[3]) && $matches[3])
			return $matches[3];
    }

    public function getName()
    {
        return 'tools_extension';
    }
}
