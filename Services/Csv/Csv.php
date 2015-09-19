<?php
namespace LemLabs\CoreBundle\Services\Csv;

use Symfony\Component\Finder\Finder;

/**
 * CSV Parser tool
 *
 */
class Csv
{
	private $path;
	private $fileName;
	private $ignoreFirstLine;
	
	public function set($path, $fileName, $ignoreFirstLine = true)
	{
		$this->path 			= $path;
		$this->fileName 		= $fileName;
		$this->ignoreFirstLine 	= $ignoreFirstLine;
	}
	
	/**
	 * Parse a csv file
	 * 
	 * @return array
	 */
	public function parseCSV()
	{
		$finder 		= new Finder();
		$rows			= array();		
		$convert_utf8 	= function($s) {
			if (!mb_check_encoding($s, 'UTF-8'))
				$s = utf8_encode($s);
				
			return $s;
		};
		
		$finder->files()
			->in($this->path)
			->name($this->fileName)
		;
		
		foreach ($finder as $file) {
			$csv = $file;
		}
		
		if (($handle = fopen($csv->getRealPath(), "r")) !== false) {
			$i = 0;
			while (($data = fgetcsv($handle, null, ";")) !== false) {
				$i++;
				if ($this->ignoreFirstLine && $i == 1) {
					continue;
				}
				$rows[] = array_map($convert_utf8, $data);
			}
			fclose($handle);
		}
		
		return $rows;
	}
}