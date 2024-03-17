import React, { useState } from 'react';
function AcceptTerms() {
     const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
    
  return (
    <>
      <section className="MainSection">
        <div className="MainDiv addthink">
          <div className="textSignStud Tostart">
            By clicking continue, You accept our{" "}
            <span> terms and regulations </span>
            <br /> {}
            regarding the examination policy. The exam will be
            <br /> {}
            <span> proctored </span>
            by
            <span> camera </span>
            and
            <span> mic </span>
            from start to finish and we
            <br /> {}
            have the right to terminate your exam/assessment if any
            <br /> {}
            <span> violation </span>
            of our rules and/or policies happened. Any
            <br /> {}
            <span> cheating </span>
            cases will not be tolerated.
          </div>
          <div className="tacbox">
            <input
              className="checkbox"
              type="radio"
              id="customCheckbox"
              onChange={handleCheckboxChange}
            />
            <label className="textCheckbox">
              I accept terms, rules and conditions.
            </label>
          </div>
          <div className="Botton">
            <button className={`Bottnclass ${isChecked ? "checked" : ""}`}>
              Start
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
export default AcceptTerms;
