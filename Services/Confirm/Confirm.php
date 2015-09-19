<?php

namespace LemLabs\CommonBundle\Services\Confirm;

/**
 * Confirmation message display
 * params (message, abstract, type (for CSS) and action)
 *
 */
class Confirm
{
	protected $message = null;
	protected $abstract;
	protected $type;
	protected $action;
	protected $twig;
 
    public function __construct(\Twig_Environment $twig)
    {
        $this->twig = $twig;
    }
	
	public function set($message, $abstract = 'Succès !', $type = 'success', $action = array('link' => '#', 'label' => 'Ajouter'))
	{
		$this->message    = $message;
		$this->abstract   = $abstract;
		$this->type       = $type;
		$this->action    = $action;
		
		return $this;
	}
	
	public function render()
	{        
        return $this->twig->render('LemLabsCommonBundle:Services:confirm.html.twig', array(
        	'message'  => $this->message,
        	'abstract' => $this->abstract,
        	'type'     => $this->type,
        	'action'   => $this->action,
        ));
	}
}