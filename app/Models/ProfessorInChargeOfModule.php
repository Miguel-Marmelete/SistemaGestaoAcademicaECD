<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfessorInChargeOfModule extends Model
{
    protected $table = 'professor_in_charge_of_module';

    // Disable incrementing for composite keys
    public $incrementing = false;

    // Define the composite primary key
    protected $primaryKey = ['professor_id', 'module_id', 'course_id'];

    // Fillable attributes
    protected $fillable = [
        'professor_id',
        'module_id',
        'course_id',
    ];

  // Override the method for handling composite keys in queries
  protected function setKeysForSaveQuery($query)
  {
      foreach ($this->primaryKey as $key) {
          $query->where($key, '=', $this->getAttribute($key));
      }
      return $query;
  }

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
