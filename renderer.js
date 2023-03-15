window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shutdown-form');
  const timeSpinner = document.getElementById('time-spinner');
  const timeUnit = document.getElementById('time-unit');
  const toggleButton = document.getElementById('toggle-button');

  let timeInMinutes = 0;
  let isHoursSelected = false;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const time = parseInt(timeSpinner.value, 10);
    if (isNaN(time) || time < 0) {
      alert('Please enter a valid time.');
      return;
    }
    if (isHoursSelected) {
      timeInMinutes = time * 60;
    } else {
      timeInMinutes = time;
    }
    const message = await window.myAPI.invoke('execute-shutdown', timeInMinutes);
    alert(message);
  });

  const cancelButton = document.getElementById('cancel-shutdown');

  cancelButton.addEventListener('click', () => {
    myAPI.invoke('cancel-shutdown').then((message) => {
      alert(message);
    });
  });

  toggleButton.addEventListener('change', () => {
    isHoursSelected = toggleButton.checked;
    if (isHoursSelected) {
      timeUnit.innerHTML = 'Hours';
      timeSpinner.max = 23;
    } else {
      timeUnit.innerHTML = 'Minutes';
      timeSpinner.max = 59;
    }
  });
});
