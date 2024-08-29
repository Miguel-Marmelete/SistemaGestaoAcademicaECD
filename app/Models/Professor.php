<?php

namespace App\Models;

 
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Professor extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;
    protected $table = 'professors';
    protected $primaryKey = 'professor_id';

    protected $fillable = [
        'name',
        'cc',
        'cc_expire_date',
        'mobile',
        'email',
        'is_coordinator',
        'password',
        'profile_picture',
    ];
    protected $hidden = [
        'password', 'remember_token',
    ];


    /**
 * Get the attributes that should be cast.
 *
 * @return array<string, string>
 */
    public function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    } 
    
    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'professor_id');
    }
}
