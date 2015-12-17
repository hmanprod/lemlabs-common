lemlabs-common (coco version) by RABOTOVAO Hery Mandimby
======================

Use an abstract class to setup CRUD Controller on SF2


** CHANGELOGS v0.1.1.a **
- Add login base template using coco template
- Handle app.user with mininal features (logout & get username)
- Add compatibility with knp_menu_bundle for rendering the left main menu
- Using coco template for CRUD
- Configuration via config.yml is loaded correctly
- Create his own block of configuration for config.yml instead of using twig globals
- Add coco template with this bundle
- Update documenation readme.md


** TODO **
- Thrown an exception if entity is not provided
- Get entity name as headline if headline is not provided
- Handle template logo via config.yml
- Ajouter la traduction fr
- Add "Setting" Entity for administration utility
--> Update logo from here
- Add "Menu" Controller to handle menu as Centurion
--> Use route + parentMenu + permission
--> List route from SF2
--> Get role entity from config.yml if not use select2 multiple input[type=text]
- Add a user minimal page for editing password and email

** BUG **
- Logout path didn't work on dev environnement


** Evolution Roadmap **
- Simplify the controller to only setup Entity référence and wording
--> Get the controller name automatically
--> Generate all routes automatically from the controller to avoid to setup them
--> Create FormType automatically  to avoid to setup it
- Generate correctly a form as Centurion and Sonata do
- Handle User CRUD and Authentification workflow


** INSTALLATION **

Install using composer :
composer require lemlabs/common-bundle dev-coco

Install assets :
php app/console assets:install

Add the bundle to AppKernel.php :
new LemLabs\CommonBundle\LemLabsCommonBundle(),
			
Enjoy



** CREATE A CRUD CONTROLLER FOR AN ENTITY OR DOCUMENT **

1. Make sure your model (entity or document) has the magic method __toString()

2. Create a controller by extending the abstract LemLabs\CommonBundle\Controller\AbstractController

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

	//Route Name (You need to create all this routes in your routing file)	
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


** UPLOAD CUSTOM BASE TEMPLATE OR FORM TEMPLATE **
Comming soon