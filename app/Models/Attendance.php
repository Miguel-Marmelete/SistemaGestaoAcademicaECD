<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';
    public $incrementing = false;

    protected $fillable = [
        'lesson_id',
        'student_id',
    ];

    protected $primaryKey = ['lesson_id', 'student_id'];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }
}
