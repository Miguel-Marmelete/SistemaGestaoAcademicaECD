<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';
    protected $primaryKey = 'student_id';

    protected $fillable = [
        'name',
        'ipbeja_email',
        'number',
        'birthday',
        'address',
        'city',
        'mobile',
        'posto',
        'nim',
        'classe',
        'personal_email',
    ];

    public function attendances()
    {
        return $this->belongsToMany(Lesson::class, 'attendance', 'lesson_id', 'student_id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id');
    }
}
