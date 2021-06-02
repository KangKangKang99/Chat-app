<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('register',[ChatController::class,'register']);
Route::post('check-mail',[ChatController::class,'checkMail']);
Route::post('check-user-name',[ChatController::class,'checkUsername']);
Route::post('login',[ChatController::class,'login']);
// middleware
Route::get('get-user',[ChatController::class,'getUser']);
Route::get('get-message',[ChatController::class,'getMessage']);
Route::post('save-message',[ChatController::class,'saveMessage']);
Route::get('get-url',[ChatController::class,'loadURL']);
