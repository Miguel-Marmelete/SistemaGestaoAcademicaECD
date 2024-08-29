<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfessorInChargeOfModule extends Model
{
    // The table associated with the model
    protected $table = 'professor_in_charge_of_module';

    // Primary key for the model
    protected $primaryKey = ['professor_id', 'module_id', 'course_id'];

    // Disable incrementing as composite keys are not auto-incrementing
    public $incrementing = false;


    // Define the fillable attributes
    protected $fillable = [
        'professor_id',
        'module_id',
        'course_id',
    ];

    // Relationships
    public function professor()
    {
        return $this->belongsTo(Professor::class, 'professor_id', 'professor_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id', 'module_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }
}
