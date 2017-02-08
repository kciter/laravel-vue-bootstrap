# laravel-vue-bootstrap
라라벨 + Vue 2.0 부트스트랩입니다.

## Server
* PHP 5.6.4
* laravel/framework 5.4

## Frontend
* laravel-mix
* vue 2.0
* vue-loader
* Webpack2
* ESLint
* Babel
* SASS
* Hot reload

## Usage
### Init
```shell
$ composer install
$ npm install
```

### Run Development Server
```shell
$ php artisan dev
```
서버를 실행시키고 자바스크립트를 빌드합니다. 자동으로 브라우저를 실행시킵니다.<br>
소스파일이 수정되면 바로 빌드되면서 핫 리로드 기능을 통해 브라우저에 즉시 반영됩니다.

### Run Production Server
```shell
$ php artisan prod
```
서버를 실행시키고 자바스크립트를 배포 버전으로 빌드합니다. 자동으로 브라우저를 실행시킵니다.<br>
소스파일을 수정해도 반영되지 않습니다.

Copyright © Trust Us Co.,Ltd. All rights reserved.
