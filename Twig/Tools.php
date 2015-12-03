<?php

namespace App\CommonBundle\Twig;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Adds some twig syntax helper extension
 *
 */
class Tools extends \Twig_Extension
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

	public function getTests()
    {
    	return array(
    	'getControllerName' =>  new \Twig_Function_Method($this, 'getControllerName')
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
