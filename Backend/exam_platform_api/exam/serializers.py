from rest_framework import serializers
from .models import Exam, ExamResults, Question, Choice
from instructor.models import Instructor
from student.models import Student
from group.models import Group
from instructor.serializers import InstructorSerializer
from student.serializers import StudentSerializer
from group.serializers import GroupSerializer


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['choice_text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ['question_text', 'question_type', 'correct_answer', 'choices']

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)
    instructor = InstructorSerializer(required=False)
    student = StudentSerializer(many=True, required=False)
    group = GroupSerializer(many=True, required=False)

    class Meta:
        model = Exam
        fields = '__all__'

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        request = self.context.get('request')
        instructor = request.user.instructor
        validated_data['instructor'] = instructor
        exam = Exam.objects.create(**validated_data)
        for question_data in questions_data:
            choices_data = question_data.pop('choices', [])
            question = Question.objects.create(exam=exam, **question_data)
            for choice_data in choices_data:
                Choice.objects.create(question=question, **choice_data)
        return exam

class ExamResultsSerializer(serializers.ModelSerializer):
    exam = ExamSerializer()
    student = StudentSerializer()
    class Meta:
        model = ExamResults
        fields = '__all__'
