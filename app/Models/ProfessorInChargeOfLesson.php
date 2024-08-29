<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfessorInChargeOfLesson extends Model
{
    protected $table = 'professor_in_charge_of_lesson';

    // Disabling auto-incrementing since we have a composite primary key
    public $incrementing = false;

    // Specify the primary keys
    protected $primaryKey = ['professor_id', 'lesson_id'];

 
    protected $fillable = ['professor_id', 'lesson_id'];

    // Disable timestamps if not needed
    public $timestamps = true;

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class, 'professor_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

  
}
