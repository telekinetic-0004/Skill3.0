// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract SkillAcquisition {
    // Define the Academic Institution struct
    struct AcademicInstitution {
        address academician;
        string name;
        string program;
    }


    // Define the Skill Holder struct
    struct SkillHolder {
        address individual;
        mapping(address => uint) financialAssets;
        mapping(address => mapping(string => bool)) acquiredSkills;
    }


    // Mapping of Skill Holder addresses to their corresponding structs
    mapping(address => SkillHolder) public skillHolders;


    // Mapping of Academic Institution addresses to their corresponding structs
    mapping(address => AcademicInstitution) public academicInstitutions;


    // Event for when an individual enrolls in a program
    event Enrollment(address indexed individual, address indexed academicInstitution, string program);


    // Event for when an individual acquires a skill
    event SkillAcquisition(address indexed individual, address indexed academicInstitution, string skill);


    // Function for an academician to enroll an individual in a program
    function enrollInProgram(address _individual, address _academicInstitution, string memory _program) public {
        require(academicInstitutions[_academicInstitution].academician == msg.sender, "Only academicians can enroll individuals in programs");
        skillHolders[_individual].financialAssets[_academicInstitution] += 100; // Assume 100 is the cost of enrollment
        emit Enrollment(_individual, _academicInstitution, _program);
    }


    // Function for an academician to mark a skill as acquired by an individual
    function acquireSkill(address _individual, address _academicInstitution, string memory _skill) public {
        require(academicInstitutions[_academicInstitution].academician == msg.sender, "Only academicians can mark skills as acquired");
        bool skillAlreadyAcquired = skillHolders[_individual].acquiredSkills[_academicInstitution][_skill];
        require(!skillAlreadyAcquired, "Skill has already been acquired");
        skillHolders[_individual].acquiredSkills[_academicInstitution][_skill] = true;
        emit SkillAcquisition(_individual, _academicInstitution, _skill);
    }
}
