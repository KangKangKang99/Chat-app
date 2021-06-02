<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Users extends Model
{
    use HasFactory;
    protected $fillable=[
        'user_id','user_name','user_email','user_password'
    ];
    protected $primaryKey='user_id';
    protected $table='tbl_users';
}
