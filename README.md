### Технологичекий стек:
- python 3
- django
- sqlite

### Инструкция по настройке проекта:
1. Склонировать проект
2. Создать проект в PyCharm с наcтройками по умолчанию
3. Обновить pip: 
```bash
pip install --upgrade pip
```
4. Установить django: 
```bash
pip install django
```
5. Синхронизировать базу данных с кодом: 
```bash
python manage.py migrate
```
6. Создать конфигурацию запуска в PyCharm (файл `manage.py`, опция `runserver`)
```bash
python manage.py runserver
```
