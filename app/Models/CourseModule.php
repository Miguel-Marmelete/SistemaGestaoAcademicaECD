<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class CourseModule extends Model
{
    use HasFactory;

    protected $table = 'course_module';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'module_id',
        'course_id',
    ];

    protected $primaryKey = ['module_id', 'course_id'];


     // Relacionamento com o modelo Course
     public function course()
     {
         return $this->belongsTo(Course::class, 'course_id');
     }
 
     // Relacionamento com o modelo Module
     public function module()
     {
         return $this->belongsTo(Module::class, 'module_id');
     }
}
