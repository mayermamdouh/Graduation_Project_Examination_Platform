import logging

from rest_framework import serializers
from .models import Exam, ExamResult, MCQQuestion, FillGapsQuestion, FreeTextQuestion, TrueFalseQuestion
from instructor.models import Instructor
from student.models import Student
from group.models import Group
from instructor.serializers import InstructorSerializer
from student.serializers import StudentSerializer
from group.serializers import GroupSerializer
from .models import MCQQuestion, TrueFalseQuestion, FillGapsQuestion, FreeTextQuestion


class MCQQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQQuestion
        fields = '__all__'


class FillGapsQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillGapsQuestion
        fields = '__all__'


class FreeTextQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreeTextQuestion
        fields = '__all__'


class TrueFalseQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrueFalseQuestion
        fields = '__all__'


class ExamSerializer(serializers.ModelSerializer):
    instructor = InstructorSerializer(required=False)
    student = StudentSerializer(many=True, required=False)
    group = GroupSerializer(many=True, required=False)
    questions = serializers.JSONField(required=False)

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
            question_type = question_data.pop('question_type')
            if question_type == "mcq":
                MCQQuestion.objects.create(exam=exam, **question_data)
            elif question_type == "fill_gaps":
                FillGapsQuestion.objects.create(exam=exam, **question_data)
            elif question_type == "free_text":
                FreeTextQuestion.objects.create(exam=exam, **question_data)
            elif question_type == "true_false":
                TrueFalseQuestion.objects.create(exam=exam, **question_data)
            else:
                print("error no exam question is created!!")
        return exam

    def to_representation(self, instance: Exam):
        data = super().to_representation(instance)

        mcqquestions = MCQQuestion.objects.filter(exam=instance)
        data['mcqquestions'] = MCQQuestionSerializer(mcqquestions, many=True).data

        fillgapsquestions = FillGapsQuestion.objects.filter(exam=instance)
        data['fillgapsquestions'] = FillGapsQuestionSerializer(fillgapsquestions, many=True).data

        freetextquestions = FreeTextQuestion.objects.filter(exam=instance)
        data['freetextquestions'] = FreeTextQuestionSerializer(freetextquestions, many=True).data

        truefalsequestions = TrueFalseQuestion.objects.filter(exam=instance)
        data['truefalsequestions'] = TrueFalseQuestionSerializer(truefalsequestions, many=True).data

        return data


class SimpleExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'name', 'duration_minutes']


class ExamResultsSerializer(serializers.ModelSerializer):
    exam = ExamSerializer()
    student = StudentSerializer()

    class Meta:
        model = ExamResult
        fields = '__all__'


class ExamToGroupSerializer(serializers.Serializer):
    group_code = serializers.UUIDField()


class ExamSubmissionSerializer(serializers.Serializer):
    questions = serializers.JSONField()
