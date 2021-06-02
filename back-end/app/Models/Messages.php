<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Messages extends Model
{
    use HasFactory;
    use HasFactory;
    protected $fillable=[
        'message_id','message_content','user_id','message_time'
    ];
    protected $primaryKey='message_id';
    protected $table='tbl_messages';
}
