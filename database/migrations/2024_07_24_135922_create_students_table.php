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
            $table->string('ipbeja_email')->unique();
            $table->integer('number')->unique();
            $table->date('birthday');
            $table->string('address');
            $table->string('city');
            $table->integer('mobile')->unique();
            $table->string('posto');
            $table->integer('nim');
            $table->string('classe');
            $table->string('personal_email')->unique();
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
