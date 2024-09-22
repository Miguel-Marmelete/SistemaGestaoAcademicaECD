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

    

    // Override the method for handling composite keys in queries
    protected function setKeysForSaveQuery($query)
    {
        foreach ($this->primaryKey as $key) {
            $query->where($key, '=', $this->getAttribute($key));
        }
        return $query;
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class, 'professor_id');
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }

  
}
