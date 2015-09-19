<?php

namespace LemLabs\CommonBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use LemLabs\CommonBundle\Model\InterfaceController;

class AbstractController extends Controller implements InterfaceController
{
	const PLURAL = 'PLURAL';
	
	const SINGULAR = 'SINGULAR';
	
	const INDEFINI = 'INDEFINI';
	
	const DEFINI = 'DEFINI';
	
	const ACCORD = 'ACCORD';
	
	const CREATE = 'CREATE';
	
	const EDIT = 'EDIT';
	
	const DELETE = 'DELETE';
	
	const INDEX = 'INDEX';
	
	const SHOW = 'SHOW';
	
	public $formType = 'LemLabs\CommonBundle\Form\DummyType'; //Don't forget to overide this
	
	public $controllerName = null; // TODO try to get this from request
	
	public $verbose = array(
			self::SINGULAR=>NULL,
			self::PLURAL=>NULL,
			self::INDEFINI=>NULL,
			self::DEFINI=>NULL,
			self::ACCORD=>NULL
			);
			
	public $routeName = array(
			self::CREATE=>NULL,
			self::EDIT=>NULL,
			self::DELETE=>NULL,
			self::INDEX=>NULL,
			self::SHOW=>NULL,
			);
	
	public $viewPath = array(
			self::CREATE=>NULL,
			self::EDIT=>NULL,
			self::DELETE=>NULL,
			self::INDEX=>NULL,
			self::SHOW=>NULL,
			);
	
	protected $defaultViewPath = array(
			self::CREATE=>'LemLabsCommonBundle:Abstract:create.html.twig',
			self::EDIT=>'LemLabsCommonBundle:Abstract:edit.html.twig',
			self::DELETE=>'LemLabsCommonBundle:Abstract:delete.html.twig',
			self::INDEX=>'LemLabsCommonBundle:Abstract:index.html.twig',
			self::SHOW=>'LemLabsCommonBundle:Abstract:show.html.twig',
			);
	
	public function getViewPath($key)
	{
		if(isset($this->viewPath[$key]) && $this->viewPath[$key])
			return $this->viewPath[$key];
		return  $this->defaultViewPath[$key];
	}
	
    public function getVerbose($key)
    {
        if(isset($this->verbose[$key]))
			return $this->verbose[$key];
		return null;
    }
	
	public function getRouteName($key)
    {
        if(isset($this->routeName[$key]))
			return $this->routeName[$key];
		return null;
    }
	
	public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $entities = $em->getRepository($this->entity)->findAll();

        return $this->render($this->getViewPath(self::INDEX), array(
        	'headline' => $this->headline,
        	'title'	   => 'Liste des '.$this->getVerbose(self::PLURAL),
            'entities' => $entities,
			'routeName'   => $this->routeName,
			'verbose' => $this->verbose,
			'controllerName' => $this->controllerName
        ));
        
    }
    
    public function showAction(Request $request)
    {
    	$em = $this->getDoctrine()->getManager();
    	
    	if ($request->isXmlHttpRequest()) {
    		$options = json_decode($request->request->get('options'));
    	
    		foreach($options as $property => $option) {
    			if ($option == 'all') {
    				unset($options->$property);
    			}
    		}
    	
    		// Get type by options pass from menu dropdown lists
    		$options 	= (array) $options;
    		$repo = $em->getRepository($this->entity);
    		if(method_exists($repo, 'findByOptions'))
    			$entities 	= $em->getRepository($this->entity)->findByOptions($options);
    		else
    			$entities 	= $em->getRepository($this->entity)->findBy($options);
    		
    		return $this->render($this->getViewPath(self::SHOW), array(
    				'entities'	=> $entities,
    				'options'	=> $options,
					'routeName'   => $this->routeName,
					'verbose' => $this->verbose
    		));
    	} else {
	    	$entities = $em->getRepository($this->entity)->findAll();
	    
	    	return $this->render($this->getViewPath(self::SHOW), array(
	    			'headline' => $this->headline,
                    'title'	   => 'Liste des '.$this->getVerbose(self::PLURAL),
                    'entities' => $entities,
					'routeName'   => $this->routeName,
					'verbose' => $this->verbose
	    	));
    	}
    
    	return true;
    }
    
    /**
     * Creates a new Type entity.
     *
     */
    public function createAction(Request $request)
    {
		$em = $this->getDoctrine()->getManager();
		$className = $em->getRepository($this->entity)->getClassName();
        $entity  = new $className();
        $form = $this->createForm(new $this->formType(), $entity);
        
        if($request->getMethod() == 'POST') {
	        $form->bind($request);
	
	        if ($form->isValid()) {
	            
	            $em->persist($entity);
	            $em->flush();
	            
	            $this->get('session')->getFlashBag()->add(
					'success',
					ucfirst($this->getVerbose(self::INDEFINI)).' '.$this->getVerbose(self::SINGULAR).' <strong>' . $entity->__toString() . '</strong> a bien été créé'.$this->getVerbose(self::ACCORD).' !'
				);
	
	            return $this->redirect($this->generateUrl($this->getRouteName(self::INDEX)));
	        }
	    }

        return $this->render($this->getViewPath(self::CREATE), array(
        	'headline' => $this->headline,
        	'title'	   => 'Ajouter '.$this->getVerbose(self::DEFINI).' '.$this->getVerbose(self::SINGULAR),
            'entity'   => $entity,
            'form'	   => $form->createView(),
			'routeName'   => $this->routeName,
			'verbose' => $this->verbose
        ));
    }

    /**
     * Edits entity.
     *
     */
    public function editAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository($this->entity)->find($id);
        
        if (!$entity) {
            $this->get('session')->getFlashBag()->add(
				'danger',
				ucfirst($this->getVerbose(self::INDEFINI)).' '.$this->getVerbose(self::SINGULAR).' sélectionné'.$this->getVerbose(self::ACCORD).' n\'existe pas !'
			);
	        
	        return $this->redirect($this->generateUrl($this->getRouteName(self::INDEX)));
        }
        
        $editForm = $this->createForm(new $this->formType(), $entity);
        
        if ($request->getMethod() == 'PUT') {
	        $editForm->bind($request);
	        
	        if ($editForm->isValid()) {
	            $em->flush();
	            
				$this->get('session')->getFlashBag()->add(
					'success',
					ucfirst($this->getVerbose(self::INDEFINI)).' '.$this->getVerbose(self::SINGULAR).' <strong>' . $entity->__toString() . '</strong> a été mise à jour !'
				);
	
	            return $this->redirect($this->generateUrl($this->getRouteName(self::INDEX)));
	        }
        }

        return $this->render($this->getViewPath(self::EDIT), array(
        	'headline'	=> $this->headline,
        	'title'		=> 'Modifier '.$this->getVerbose(self::DEFINI).' '.$this->getVerbose(self::SINGULAR),
            'entity'	=> $entity,
            'edit_form' => $editForm->createView(),
			'routeName'   => $this->routeName,
			'verbose' => $this->verbose
        ));
    }
    
    /**
     * Deletes a Niveau entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
    	$em = $this->getDoctrine()->getManager();
        $entity = $em->getRepository($this->entity)->find($id);

        if (!$entity) {
            $this->get('session')->getFlashBag()->add(
				'danger',
				ucfirst($this->getVerbose(self::INDEFINI)).' '.$this->getVerbose(self::SINGULAR).' sélectionné'.$this->getVerbose(self::ACCORD).' n\'existe pas !'
			);
	        
	        return $this->redirect($this->generateUrl($this->getRouteName(self::INDEX)));
        }
        
    	if ($request->isXmlHttpRequest()) {
	    	$confirm = $this->container->get('Confirm');
	    	
	    	return new JsonResponse(array(
	    		'response' => $confirm->set('Êtes-vous sûr de vouloir supprimer '.$this->getVerbose(self::INDEFINI).' '.$this->getVerbose(self::SINGULAR).' <strong>' . $entity->__toString() . '</strong> ?', 'Êtes-vous sûr ?', 'error', array(
	    			'link'  => $request->request->get('action'),
	    			'label' => 'Supprimer',
	    		))->render(),
	    	));
    	}
    	
    	if ($request->getMethod() == 'GET') {
				$em->remove($entity);
				$em->flush();
	        	
	            $this->get('session')->getFlashBag()->add(
					'success',
					ucfirst($this->getVerbose(self::INDEFINI)).' '.$this->getVerbose(self::SINGULAR).' <strong>' . $entity->__toString() . '</strong> a été supprimé'.$this->getVerbose(self::ACCORD).' !'
				);
		        
		        return $this->redirect($this->generateUrl($this->getRouteName(self::INDEX)));
               
        }
    }
}
