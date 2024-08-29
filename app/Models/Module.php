<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $table = 'modules';
    protected $primaryKey = 'module_id';

    protected $fillable = [
        'name',
        'contact_hours',
        'abbreviation',
        'ects',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_module', 'module_id', 'course_id');
    }

    public function submodules()
    {
        return $this->hasMany(Submodule::class, 'module_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'module_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'module_id');
    }
}
