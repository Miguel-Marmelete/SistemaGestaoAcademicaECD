<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeEvaluationMoment extends Model
{
     // The table associated with the model
     protected $table = 'grade_evaluation_moment';

     // Primary key for the model
     protected $primaryKey = ['evaluation_moment_id', 'student_id'];
 
     // Disable incrementing as composite keys are not auto-incrementing
     public $incrementing = false;
 
     // Specify the data type of the primary key
     protected $keyType = 'string'; // Use 'int' if your primary keys are integers
 
     // Define the fillable attributes
     protected $fillable = [
         'evaluation_moment_grade_value',
         'evaluation_moment_id',
         'student_id',
     ];

     protected function setKeysForSaveQuery($query)
     {
         foreach ($this->primaryKey as $key) {
             $query->where($key, '=', $this->getAttribute($key));
         }
         return $query;
     }
     // Define the relationships
     public function evaluationMoment()
     {
         return $this->belongsTo(EvaluationMoment::class, 'evaluation_moment_id', 'evaluation_moment_id');
     }
 
     public function student()
     {
         return $this->belongsTo(Student::class, 'student_id', 'student_id');
     }
}
