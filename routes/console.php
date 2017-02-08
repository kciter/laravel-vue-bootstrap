<?php

use Illuminate\Foundation\Inspiring;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->describe('Display an inspiring quote');

Artisan::command('dev', function () {
    $this->comment('Running at dev server.');

    $artisan = new Process('php artisan serve');
    $artisan->start();

    $watch = new Process('npm run watch');
    $watch->start();

    $hot = new Process('npm run hot');
    $hot->start();

    $this->info('Dev server is running at http://127.0.0.1:8000/.');

    usleep(800000);
    $this->info('.');
    usleep(800000);
    $this->info('.');
    usleep(800000);

    $this->info('Open the http://127.0.0.1:8000/');
    $open = new Process('open http://127.0.0.1:8000');
    $open->run();

    do {
    } while ($artisan->isRunning() && $watch->isRunning() && $hot->isRunning() && (sleep(1) !== false));

    if (!$artisan->isSuccessful()) {
        throw new ProcessFailedException($artisan);
    } else if (!$watch->isSuccessful()) {
        throw new ProcessFailedException($watch);
    } else if (!$hot->isSuccessful()) {
        throw new ProcessFailedException($hot);
    }
})->describe('Running at development server.');

Artisan::command('prod', function () {
    $this->comment('Make production js, css file.');
    $process = new Process('npm run production');
    $process->run();

    $this->comment('Running at production server.');
    $process = new Process('npm run production && php artisan serve');
    $process->start();

    $this->info('Production server is running at http://127.0.0.1:8000/.');

    usleep(800000);
    $this->info('.');
    usleep(800000);
    $this->info('.');
    usleep(800000);

    $this->info('Open the http://127.0.0.1:8000/');
    $open = new Process('open http://127.0.0.1:8000');
    $open->run();

    do {
    } while ($process->isRunning() && (sleep(1) !== false));
    if (!$process->isSuccessful()) {
        throw new ProcessFailedException($process);
    }
})->describe('Running at development server.');