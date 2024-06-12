from rest_framework import serializers
from .models import Group, Membership
from django.contrib.auth.models import User
from instructor.models import Instructor
import uuid


class MembershipSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    group_id = serializers.PrimaryKeyRelatedField(source='group.id', read_only=True)

    class Meta:
        model = Membership
        fields = ["student_name", "group_name", "joined_date", "group_id"]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name", "description", "code"]

    def create(self, validated_data):
        user: User = self.context['request'].user
        instructor: Instructor = user.instructor
        validated_data['instructor'] = instructor
        validated_data['code'] = uuid.uuid4()
        group = Group.objects.create(**validated_data)
        return group


class GroupSerializerListView(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name", "description", "code", "created_at", "updated_at"]


class StudentGroupSerializerListView(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ["name", "description"]
