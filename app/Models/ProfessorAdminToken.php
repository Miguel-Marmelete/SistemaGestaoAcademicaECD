<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfessorAdminToken extends Model
{
    use HasFactory;

    protected $table = 'professor_admin_tokens';
    protected $primaryKey = 'id';
    protected $fillable = ['professor_id', 'token'];
    public $timestamps = true;

    public function professor()
    {
        return $this->belongsTo(Professor::class, 'professor_id', 'professor_id');
    }
    
}
