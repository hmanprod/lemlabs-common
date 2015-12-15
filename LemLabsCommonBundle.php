<?php

namespace LemLabs\CommonBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class LemLabsCommonBundle extends Bundle
{
    public function getContainerExtension()
    {
        return new DependencyInjection\LemLabsCommonExtension();
    }
}
