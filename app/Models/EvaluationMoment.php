<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvaluationMoment extends Model
{
    // The table associated with the model
    protected $table = 'evaluation_moments';

    // The primary key associated with the table
    protected $primaryKey = 'evaluation_moment_id';

   
    // Disable auto-incrementing
    public $incrementing = true;

    // Define the fillable attributes
    protected $fillable = [
        'type',
        'course_id',
        'professor_id',
        'module_id',
        'submodule_id',
    ];

    // Define relationships
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id', 'course_id');
    }

    public function professor()
    {
        return $this->belongsTo(Professor::class, 'professor_id', 'professor_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id', 'module_id');
    }

    public function submodule()
    {
        return $this->belongsTo(Submodule::class, 'submodule_id', 'submodule_id');
    }
}
