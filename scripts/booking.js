document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('booking-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      date: form.date.value,
      time: form.time.value
    };

    // Basic validation
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert('Veuillez remplir tous les champs.');
        return;
      }
    }

    // Prepare server integration
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Votre demande a été envoyée.');
        form.reset();
      } else {
        alert('Une erreur est survenue.');
      }
    } catch (err) {
      console.error(err);
      alert("Impossible d'envoyer votre demande pour le moment.");
    }
  });
});
