import NavBarStudent from "../NavbarStudent";

function Review() {
  return (
    <>
      <div className="MainDivStudentPage">
        <NavBarStudent />
        <div className="MianPageStudent">
          <div className="MyGroupsWord">All Tests</div>
          <div className="MianPageStudentTestsReview ">
            <div className="makePadding">
              <div className="firstColumn">
                <div className="NameOfInformation">
                  <div className="Named"> Attempts Allowed:</div>
                  <span className="theInformation">1</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Percentage:</div>
                  <span className="theInformation">100%</span>
                </div>

                <div className="NameOfInformation">
                  <div className="Named"> Date Started:</div>
                  <span className="theInformation">Mon 22Apr 2024 20:30 </span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Date Finished:</div>
                  <span className="theInformation">Mon 22Apr 2024 22:30</span>
                </div>
              </div>
              <div className="secondColumn">
                <div className="LineVertical"></div>
              </div>
              <div className="firstColumn">
                <div className="NameOfInformation">
                  <div className="Named">Marks:</div>
                  <span className="theInformation">30/30</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Grade:</div>
                  <span className="theInformation">14/15</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Time Limit:</div>
                  <span className="theInformation">45</span>
                </div>
                <div className="NameOfInformation">
                  <div className="Named">Duration:</div>
                  <span className="theInformation">00:00:0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Review;
