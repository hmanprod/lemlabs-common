lemlabs-common (coco version) by RABOTOVAO Hery Mandimby
======================

Use an abstract class to setup CRUD Controller on SF2



** TODO **
- Add "Setting" Entity for administration utility
- Testing the coco template as new layout



** INSTALLATION **

Install using composer :
composer require lemlabs/common-bundle dev-coco

Configure le layout dans config.yml :
twig:
    form:
        resources:
            - "::forms-bootstrap3.html.twig"
    globals:
        common_bundle :
            template : "::base-coco.html.twig"
			
Enjoy



** CREATE A CRUD CONTROLLER FOR AN ENTITY OR DOCUMENT **

1.Make sure your model (entity or document) has the magic method __toString()

2.Create a controller by extending the abstract LemLabs\CommonBundle\Controller\AbstractController

3. Fill this attribute in your controller. See the example below :
	
	//Entity Name
	public $entity = 'AppCoreBundle:Category';
	
	//Controller Name
	public $controllerName = 'AppCoreBundle:Category';
	
	//Form Name
	public $formType = 'App\CoreBundle\Form\CategoryType';
	
	//Headline
	public $headline ='Category';
	
	//View Path (Not mandatory. Here you can overide default view.)
	//public $viewPath = array(
    //    self::CREATE => 'LemLabsCommonBundle:Abstract:create.html.twig',
    //    self::EDIT => 'LemLabsCommonBundle:Abstract:edit.html.twig',
    //    self::INDEX => 'LemLabsCommonBundle:Abstract:index.html.twig',
    //    self::SHOW => 'LemLabsCommonBundle:Abstract:show.html.twig',
    //);
	
	
	//Route Name	
	public $routeName = array(
			self::CREATE=>'admin_category_create',
			self::EDIT=>'admin_category_edit',
			self::DELETE=>'admin_category_delete',
			self::INDEX=>'admin_category_index',
			self::SHOW=>'admin_category_show',
			);
	
	//Verbose
	public $verbose = array(
			self::SINGULAR=>'category',
			self::PLURAL=>'categories',
			self::INDEFINI=>'the',
			self::DEFINI=>'a',
			self::ACCORD=>NULL
			);

4. Overide default action from LemLabs\CommonBundle\Controller\AbstractController if needed (Optionnal)