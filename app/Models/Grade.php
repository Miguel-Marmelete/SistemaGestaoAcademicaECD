<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    use HasFactory;

    protected $table = 'grades';
    protected $primaryKey = 'grade_id';

    protected $fillable = [
        'module_id',
        'student_id',
        'grade_value',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
