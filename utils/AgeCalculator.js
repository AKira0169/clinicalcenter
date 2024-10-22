class AgeCalculator {
  constructor(birthDate) {
    this.birthDate = new Date(birthDate);
    this.today = new Date();
  }

  calculateAge() {
    let age = this.today.getFullYear() - this.birthDate.getFullYear();

    // Adjust age based on whether the birthday has occurred this year
    if (
      this.today.getMonth() < this.birthDate.getMonth() ||
      (this.today.getMonth() === this.birthDate.getMonth() &&
        this.today.getDate() < this.birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}

module.exports = AgeCalculator;
