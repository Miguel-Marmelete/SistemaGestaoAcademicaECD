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
        Schema::create('grade_evaluation_moment', function (Blueprint $table) {
            $table->decimal('evaluation_moment_grade_value', 4, 2)->check('evaluation_moment_grade_value >= 0 and evaluation_moment_grade_value <= 20');
            $table->foreignId('evaluation_moment_id')->constrained('evaluation_moments', 'evaluation_moment_id')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students', 'student_id')->onDelete('cascade');
            $table->primary(['evaluation_moment_id', 'student_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grade_evaluation_moment');
    }
};
