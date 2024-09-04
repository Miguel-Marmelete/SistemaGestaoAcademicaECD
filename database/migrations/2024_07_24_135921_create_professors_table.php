<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('professors', function (Blueprint $table) {
            $table->id('professor_id');
            $table->string('name');
            $table->integer('cc')->nullable();
            $table->date('cc_expire_date')->nullable();
            $table->integer('mobile')->nullable();
            $table->string('email');
            $table->boolean('is_coordinator')->default(false);
            $table->string('password');
            $table->string('profile_picture')->nullable();
            //$table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professors');
    }
};
