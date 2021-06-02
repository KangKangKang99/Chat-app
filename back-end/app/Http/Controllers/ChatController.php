<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Messages;
use App\Models\Users;
use Firebase\JWT\JWT;
use Illuminate\Support\Carbon;
class ChatController extends Controller
{
    private $key='Token_JWT';

    public function register(Request $request){
        $user= new Users();
        $user->user_name=$request['user_name'];
        $user->user_email=$request['user_email'];
        $user->user_password=$request['user_password'];
        $user->save();
        $saved=$user->save();
        if($saved) return response()->json(['success'=> 'Successfully register!']);
        else return response()->json(['err'=> 'Successfully register!']);

    }
    public function login(Request $request){
        /*login with token*/
       if($request['user_token']) {
            $decode=JWT::decode($request['user_token'],$this->key,array('HS256'));
            $user = Users::where('user_email',$decode->mail)->first();
            if($user){
                if($user->user_id==$decode->id){
                    return response()->json(['user_email'=>$user->user_email,
                                             'user_name'=>$user->user_name,
                                             'loginSuccess'=>'Login with token successfully!']);
                }
                else return 'da co loi xac thuc. Xin hay dang nhap lai';
            }
            else return 'da co loi xac thuc. Xin hay dang nhap lai';
       }
       /*login without token*/
       else {
           $user=Users::where('user_email',$request['user_email'])->first();
           if($user) {
               if($user->user_password==$request['user_password']) {
                   if($request['remember_me']=='true') {
                       $token=$this->createToken($user->user_id,$user->user_email);
                       return response()->json(['user_token'=>$token,'loginSuccess'=>'Login successfully!','user_name'=>$user->user_name]);
                   }
                   else return response()->json(['loginSuccess'=>'login with pass successfully!','user_name'=>$user->user_name]);
               }
               else return response()->json(['loginFail'=>'Incorrect password!']);
           }
           else return response()->json(['loginFail'=>'User not exist!']);
       }

    }
    public function checkMail(Request $request){
        $exitsMail=Users::where('user_email',$request['user_email'])->first();
        if($exitsMail) return false;
        else return true;
    }
    public function checkUsername(Request $request){
        $exitUsername=Users::where('user_name',$request['user_name'])->first();
        if($exitUsername) return false;
        else return true;
    }
    public function getUser(){
        $user_name=Users::pluck('user_name');
        return response()->json(['user_name'=>$user_name]);
    }
    public function getMessage(){
        $message=Messages::join('tbl_users','tbl_users.user_id','=','tbl_messages.user_id')
            ->select('user_name','message_content','message_time','message_id')->orderby('message_id','desc')->paginate(20);
        return $message;
    }
    public function saveMessage(Request $request){
        $datetime = now();
        $datetime->setTimezone('Asia/Ho_Chi_Minh');
        $user= Users::where('user_name',$request['user_name'])->pluck('user_id')->first();
        if($user){
            $message = new Messages();
            $message->message_content=$request['message_content'];
            $message->user_id= $user;
            $message->message_time=$datetime;
            $message->save();
            return $message;
        }
        else return 'da co loi';
    }

    private function createToken($userID,$userEmail){
        $key=$this->key;
        $payload=array(
            'id'=> $userID,
            'mail'=>$userEmail,
        );
        $jwt=JWT::encode($payload,$key);
        return $jwt;
    }
}
