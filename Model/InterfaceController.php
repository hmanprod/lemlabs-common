<?php

namespace LemLabs\CommonBundle\Model;

use Symfony\Component\HttpFoundation\Request;

interface InterfaceController
{
	public function getViewPath($key);
	
	public function getVerbose($key);
	
	public function getRouteName($key);
	
    public function indexAction(Request $request);
	
	public function showAction(Request $request);
	
	public function createAction(Request $request);
	
	public function editAction(Request $request, $id);
	
	public function deleteAction(Request $request, $id);
}
