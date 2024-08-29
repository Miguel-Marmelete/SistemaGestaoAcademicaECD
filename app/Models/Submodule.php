<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submodule extends Model
{
    use HasFactory;

    protected $table = 'submodules';
    protected $primaryKey = 'submodule_id';

    protected $fillable = [
        'name',
        'abbreviation',
        'contact_hours',
        'module_id',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
