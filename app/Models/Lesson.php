<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $table = 'lessons';
    protected $primaryKey = 'lesson_id';

    protected $fillable = [
        'title',
        'type',
        'summary',
        'submodule_id',
        'course_id',
        'date',
    ];


    public function submodule()
    {
        return $this->belongsTo(Submodule::class, 'submodule_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'attendance', 'lesson_id', 'student_id');
    }
    public function professors()
    {
        return $this->belongsToMany(Professor::class, 'professor_in_charge_of_lesson', 'lesson_id', 'professor_id');
    }
}
