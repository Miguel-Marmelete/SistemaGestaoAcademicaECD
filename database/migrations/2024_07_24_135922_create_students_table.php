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
        Schema::create('students', function (Blueprint $table) {
            $table->id('student_id');
            $table->string('name');
            $table->string('ipbeja_email');
            $table->integer('number');
            $table->date('birthday')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->integer('mobile')->nullable();
            $table->string('posto')->nullable();
            $table->integer('nim')->nullable();
            $table->string('classe')->nullable();
            $table->string('personal_email');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
