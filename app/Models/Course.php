<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';
    protected $primaryKey = 'course_id';

    protected $fillable = [
        'abbreviation',
        'name',
        'date',
        'schedule',
    ];



    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'course_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'course_id');
    }
}
