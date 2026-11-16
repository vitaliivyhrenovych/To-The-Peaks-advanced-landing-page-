(() => {
  'use strict';

  const form = document.getElementById('tour-builder-form');
  const totalOutput =
    document.getElementById('total-price') ||
    document.getElementById('tour-summary-total-value');
  const priceFormatter = new Intl.NumberFormat('uk-UA');

  const choices = {
    duration: {
      id: 'duration',
      name: 'tour-duration',
      groupId: 'tour-duration-group',
      errorId: 'tour-duration-error',
      errorMessage: 'Оберіть тривалість туру зі списку.',
      summaryId: 'tour-summary-duration-value',
      priceId: 'tour-summary-base-price-value',
      values: {
        '1': { amount: 1500, label: '1 день' },
        '2': { amount: 3000, label: '2 дні' },
        '3': { amount: 4500, label: '3 дні' },
        '5': { amount: 7500, label: '5 днів' },
        '7': { amount: 10500, label: '7 днів' },
      },
    },
    guides: {
      id: 'guides',
      name: 'tour-guides',
      groupId: 'tour-guides-group',
      errorId: 'tour-guides-error',
      errorMessage: 'Оберіть кількість гідів.',
      summaryId: 'tour-summary-guides-value',
      priceId: 'tour-summary-guides-price-value',
      values: {
        '0': { amount: 0, label: 'Без гіда' },
        none: { amount: 0, label: 'Без гіда' },
        '1': { amount: 1250, label: '1 гід' },
        '2': { amount: 2500, label: '2 гіди' },
      },
    },
    equipment: {
      id: 'equipment',
      name: 'tour-equipment',
      groupId: 'tour-equipment-group',
      errorId: 'tour-equipment-error',
      errorMessage: 'Оберіть варіант спорядження.',
      summaryId: 'tour-summary-equipment-value',
      priceId: 'tour-summary-equipment-price-value',
      values: {
        '0': { amount: 0, label: 'Без спорядження' },
        none: { amount: 0, label: 'Без спорядження' },
        basic: { amount: 1000, label: 'Базовий комплект' },
        extended: { amount: 3000, label: 'Розширений комплект' },
      },
    },
    transfer: {
      id: 'transfer',
      name: 'tour-transfer',
      groupId: 'tour-transfer-group',
      errorId: 'tour-transfer-error',
      errorMessage: 'Оберіть варіант трансферу.',
      summaryId: 'tour-summary-transfer-value',
      priceId: 'tour-summary-transfer-price-value',
      values: {
        '0': { amount: 0, label: 'Без трансферу' },
        none: { amount: 0, label: 'Без трансферу' },
        'one-way': { amount: 500, label: 'В один бік' },
        'round-trip': { amount: 1000, label: 'В обидва боки' },
        both: { amount: 1000, label: 'В обидва боки' },
      },
    },
  };

  const priceOutputIds = [
    'tour-summary-base-price-value',
    'tour-summary-guides-price-value',
    'tour-summary-equipment-price-value',
    'tour-summary-transfer-price-value',
  ];

  function getControl(choice) {
    const control = document.getElementById(choice.id);

    if (control) {
      return control;
    }

    const scope = form || document;
    return scope.querySelector(
      `input[name="${choice.name}"]:checked, select[name="${choice.name}"]`
    );
  }

  function readChoice(choice) {
    const control = getControl(choice);

    if (
      !(control instanceof HTMLInputElement) &&
      !(control instanceof HTMLSelectElement)
    ) {
      return { valid: false, control: null, choice };
    }

    const value = control.value.trim();
    const selected = Object.prototype.hasOwnProperty.call(choice.values, value)
      ? choice.values[value]
      : null;

    if (!selected || !Number.isFinite(selected.amount) || selected.amount < 0) {
      return { valid: false, control, choice };
    }

    return { valid: true, control, selected, choice };
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  function formatPrice(amount) {
    return `${priceFormatter.format(amount)} грн`;
  }

  function clearValidationErrors() {
    Object.values(choices).forEach((choice) => {
      const control = getControl(choice);
      const group = document.getElementById(choice.groupId);
      const error = document.getElementById(choice.errorId);

      if (control) {
        control.removeAttribute('aria-invalid');
      }

      if (group) {
        group.removeAttribute('aria-invalid');
      }

      if (error) {
        error.textContent = '';
        error.classList.add('hidden');
      }
    });

    const summaryError = document.getElementById('tour-summary-error');

    if (summaryError) {
      summaryError.textContent = '';
      summaryError.classList.add('hidden');
    }
  }

  function showInvalidState(invalidSelection) {
    clearValidationErrors();

    if (invalidSelection) {
      const { choice, control } = invalidSelection;
      const group = document.getElementById(choice.groupId);
      const error = document.getElementById(choice.errorId);

      if (control) {
        control.setAttribute('aria-invalid', 'true');
      }

      if (group) {
        group.setAttribute('aria-invalid', 'true');
      }

      if (error) {
        error.textContent = choice.errorMessage;
        error.classList.remove('hidden');
      }
    } else {
      const summaryError = document.getElementById('tour-summary-error');

      if (summaryError) {
        summaryError.textContent =
          'Не вдалося розрахувати вартість. Перевірте вибрані параметри.';
        summaryError.classList.remove('hidden');
      }
    }

    totalOutput.textContent = 'Перевірте параметри';
    priceOutputIds.forEach((id) => setText(id, '—'));
  }

  function updatePrice() {
    if (!totalOutput) {
      console.error(
        'Калькулятор туру: не знайдено #total-price або #tour-summary-total-value.'
      );
      return;
    }

    const selections = Object.values(choices).map(readChoice);
    const invalidSelection = selections.find((selection) => !selection.valid);

    if (invalidSelection) {
      showInvalidState(invalidSelection);
      return;
    }

    clearValidationErrors();

    const [duration, guides, equipment, transfer] = selections.map(
      (selection) => selection.selected
    );
    const total =
      duration.amount + guides.amount + equipment.amount + transfer.amount;

    if (
      !Number.isFinite(total) ||
      total < 0 ||
      total > Number.MAX_SAFE_INTEGER
    ) {
      showInvalidState(null);
      return;
    }

    setText('tour-summary-duration-value', duration.label);
    setText('tour-summary-guides-value', guides.label);
    setText('tour-summary-equipment-value', equipment.label);
    setText('tour-summary-transfer-value', transfer.label);
    setText('tour-summary-base-price-value', formatPrice(duration.amount));
    setText('tour-summary-guides-price-value', formatPrice(guides.amount));
    setText('tour-summary-equipment-price-value', formatPrice(equipment.amount));
    setText('tour-summary-transfer-price-value', formatPrice(transfer.amount));
    totalOutput.textContent = formatPrice(total);
  }

  const eventTarget = form || document;
  eventTarget.addEventListener('change', updatePrice);
  updatePrice();
})();
